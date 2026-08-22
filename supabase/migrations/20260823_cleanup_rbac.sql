-- ==============================================================================
-- Rollback / Cleanup: Xóa bỏ custom RBAC phức tạp, quay về Supabase Auth gốc
-- Sử dụng chuẩn: anon (Khách công khai) vs authenticated (Thành viên Lab)
-- ==============================================================================

-- 1. Xóa Trigger và Function gán role
DROP TRIGGER IF EXISTS on_auth_user_created_add_role ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user_role();

-- 2. Xóa Custom Access Token Hook
DROP FUNCTION IF EXISTS public.custom_access_token_hook(JSONB);

-- 3. Xóa RPC switch role
DROP FUNCTION IF EXISTS public.switch_user_role(public.app_role);
DROP FUNCTION IF EXISTS public.switch_user_role(TEXT);

-- 4. Xóa bảng public.user_roles
DROP TABLE IF EXISTS public.user_roles CASCADE;

-- 5. Xóa Enum app_role
DROP TYPE IF EXISTS public.app_role CASCADE;

-- 6. Chuẩn hóa RLS của bảng research_papers về cơ chế mặc định của Supabase
DO $$ BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'research_papers'
    ) THEN
        DROP POLICY IF EXISTS "Only researchers can insert papers" ON public.research_papers;
        DROP POLICY IF EXISTS "Researchers can update their own papers" ON public.research_papers;
        DROP POLICY IF EXISTS "Anyone authenticated can view published papers" ON public.research_papers;
        DROP POLICY IF EXISTS "Public can view published papers" ON public.research_papers;
        DROP POLICY IF EXISTS "Authenticated users can insert papers" ON public.research_papers;
        DROP POLICY IF EXISTS "Authors can update own papers" ON public.research_papers;

        -- Khách (anon) & Thành viên (authenticated) đều có thể xem bài báo đã xuất bản
        CREATE POLICY "Public can view published papers"
        ON public.research_papers FOR SELECT
        TO anon, authenticated
        USING (is_published = true OR auth.uid() = author_id);

        -- Bất kỳ thành viên lab nào đăng nhập đều có quyền tạo bài báo
        CREATE POLICY "Authenticated users can insert papers"
        ON public.research_papers FOR INSERT
        TO authenticated
        WITH CHECK (true);

        -- Thành viên có thể chỉnh sửa bài báo do chính mình tạo
        CREATE POLICY "Authors can update own papers"
        ON public.research_papers FOR UPDATE
        TO authenticated
        USING (auth.uid() = author_id);
    END IF;
END $$;
