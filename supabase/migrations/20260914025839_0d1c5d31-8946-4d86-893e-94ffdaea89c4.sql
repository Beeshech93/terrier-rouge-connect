
CREATE POLICY "media_admin_all" ON storage.objects FOR ALL TO authenticated
USING (bucket_id IN ('project-images','project-videos','project-documents','avatars') AND public.is_admin())
WITH CHECK (bucket_id IN ('project-images','project-videos','project-documents','avatars') AND public.is_admin());

CREATE POLICY "avatars_own" ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'avatars' AND owner = auth.uid())
WITH CHECK (bucket_id = 'avatars' AND owner = auth.uid());
