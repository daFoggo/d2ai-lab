-- ==============================================================================
-- Pass-through Auth Hook: Ngăn chặn lỗi Hook URI khi Supabase Dashboard
-- vẫn còn cấu hình Auth Hook custom_access_token_hook
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event JSONB)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Trả về nguyên bản event mà không can thiệp custom claims hay roles
    RETURN event;
END;
$$;

-- Phân quyền cho Supabase Auth Admin
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.custom_access_token_hook(JSONB) TO supabase_auth_admin;
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook(JSONB) FROM authenticated, anon, public;
