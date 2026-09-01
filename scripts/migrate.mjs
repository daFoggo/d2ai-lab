import fs from "node:fs";
import path from "node:path";
import pg from "pg";

const { Client } = pg;

const PROJECT_REF = "vdhrmrljuiupdgdnsrzz";
const DB_PASSWORD = process.env.DB_PASSWORD || "eTzbq9zGxNHDbRfO";

// Tất cả các vùng AWS của Supabase Pooler
const allPoolerRegions = [
	"ap-southeast-2", // Sydney (primary)
	"ap-southeast-1", // Singapore
	"ap-northeast-1", // Tokyo
	"ap-northeast-2", // Seoul
	"ap-south-1",     // Mumbai
	"us-east-1",       // N. Virginia
	"us-east-2",       // Ohio
	"us-west-1",       // N. California
	"us-west-2",       // Oregon
	"ca-central-1",    // Canada
	"eu-central-1",    // Frankfurt
	"eu-west-1",       // Ireland
	"eu-west-2",       // London
	"eu-west-3",       // Paris
	"eu-north-1",      // Stockholm
	"sa-east-1",       // São Paulo
	"me-central-1",    // UAE
	"me-south-1",      // Bahrain
	"af-south-1",      // Cape Town
];

const runMigration = async () => {
	const migrationsDir = path.resolve(process.cwd(), "supabase/migrations");
	if (!fs.existsSync(migrationsDir)) {
		console.error("❌ Không tìm thấy thư mục migrations tại:", migrationsDir);
		process.exit(1);
	}

	const files = fs
		.readdirSync(migrationsDir)
		.filter((f) => f.endsWith(".sql"))
		.sort();

	console.log(`📄 Tìm thấy ${files.length} file migration:`, files);

	let connectedClient = null;

	for (const region of allPoolerRegions) {
		const host = `aws-0-${region}.pooler.supabase.com`;
		const client = new Client({
			host: host,
			port: 6543,
			user: `postgres.${PROJECT_REF}`,
			password: DB_PASSWORD,
			database: "postgres",
			ssl: { rejectUnauthorized: false },
			connectionTimeoutMillis: 5000,
		});

		try {
			await client.connect();
			console.log(`\n🎉 KẾT NỐI THÀNH CÔNG TỚI SUPABASE DB (${region})!`);
			connectedClient = client;
			break;
		} catch {
			process.stdout.write(`.`);
			await client.end().catch(() => {});
		}
	}

	if (!connectedClient) {
		console.error("\n❌ Không thể kết nối tới pooler nào của Supabase.");
		process.exit(1);
	}

	try {
		// Tracking: chỉ chạy migration chưa áp dụng (schema private, không expose qua PostgREST).
		// Tự động kế thừa bảng tracking cũ public.schema_migrations nếu còn.
		await connectedClient.query(`
			CREATE SCHEMA IF NOT EXISTS app_migrations;
			CREATE TABLE IF NOT EXISTS app_migrations.applied (
				name        TEXT PRIMARY KEY,
				applied_at  TIMESTAMPTZ NOT NULL DEFAULT now()
			);
			DO $$ BEGIN
				IF to_regclass('public.schema_migrations') IS NOT NULL THEN
					INSERT INTO app_migrations.applied (name, applied_at)
					SELECT name, applied_at FROM public.schema_migrations
					ON CONFLICT (name) DO NOTHING;
				END IF;
			END $$;
		`);
		const { rows: appliedRows } = await connectedClient.query(
			"SELECT name FROM app_migrations.applied",
		);
		const applied = new Set(appliedRows.map((row) => row.name));
		const pending = files.filter((file) => !applied.has(file));

		if (pending.length === 0) {
			console.log("\n✅ Không có migration mới — tất cả đã được áp dụng.");
			return;
		}

		for (const file of pending) {
			const filePath = path.join(migrationsDir, file);
			console.log(`\n🚀 Đang thực thi migration: ${file}...`);
			const sqlContent = fs.readFileSync(filePath, "utf-8");
			await connectedClient.query(sqlContent);
			await connectedClient.query(
				"INSERT INTO app_migrations.applied (name) VALUES ($1)",
				[file],
			);
			console.log(`✅ Hoàn thành file: ${file}`);
		}

		console.log("\n🎉 ========================================================");
		console.log("🎉 TOÀN BỘ MIGRATION ĐÃ ĐƯỢC CHẠY THÀNH CÔNG TRÊN SUPABASE!");
		console.log("🎉 ========================================================");
	} catch (error) {
		console.error("❌ Lỗi khi thực thi SQL:", error);
		process.exit(1);
	} finally {
		await connectedClient.end();
	}
}

runMigration();
