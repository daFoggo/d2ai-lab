import fs from "node:fs";
import path from "node:path";
import pg from "pg";

const { Client } = pg;

const PROJECT_REF = "vdhrmrljuiupdgdnsrzz";
const DB_PASSWORD = process.env.DB_PASSWORD || "eTzbq9zGxNHDbRfO";

// Tất cả các vùng AWS của Supabase Pooler
const allPoolerRegions = [
	"ap-southeast-1", // Singapore
	"ap-southeast-2", // Sydney
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

async function runMigration() {
	const sqlPath = path.resolve(process.cwd(), "supabase/migrations/20260821_auth_rbac.sql");
	const sqlContent = fs.readFileSync(sqlPath, "utf-8");
	console.log("📄 Đã nạp file SQL migration:", sqlPath);

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
			connectionTimeoutMillis: 4000,
		});

		try {
			await client.connect();
			console.log(`\n🎉 KẾT NỐI THÀNH CÔNG TỚI VÙNG: ${region} (${host})!`);
			connectedClient = client;
			break;
		} catch (err) {
			process.stdout.write(`.`);
			await client.end().catch(() => {});
		}
	}

	if (!connectedClient) {
		console.error("\n❌ Không thể kết nối tới pooler nào của Supabase.");
		process.exit(1);
	}

	try {
		console.log("\n🚀 Đang thực thi toàn bộ script Migration SQL...");
		await connectedClient.query(sqlContent);
		console.log("\n🎉 ========================================================");
		console.log("🎉 MIGRATION THÀNH CÔNG RỰC RỠ 100% TRÊN SUPABASE DATABASE!");
		console.log("🎉 ========================================================");
		console.log("👉 Đã tạo xong:");
		console.log("   - Enum app_role ('user', 'researcher')");
		console.log("   - Bảng public.user_roles");
		console.log("   - Trigger handle_new_user_role tự động gán role khi đăng ký");
		console.log("   - Postgres function custom_access_token_hook");
		console.log("   - Phân quyền GRANT cho supabase_auth_admin");
		console.log("   - Bảng và RLS policies cho research_papers");
	} catch (error) {
		console.error("❌ Lỗi khi thực thi SQL:", error);
		process.exit(1);
	} finally {
		await connectedClient.end();
	}
}

runMigration();
