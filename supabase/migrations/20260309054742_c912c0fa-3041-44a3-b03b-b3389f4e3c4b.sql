CREATE POLICY "Users can delete own pending payment requests"
ON public.payment_requests
FOR DELETE
TO authenticated
USING (auth.uid() = user_id AND status = 'pending');