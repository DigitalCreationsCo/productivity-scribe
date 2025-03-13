
import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function GoogleAuth() {
  const { login } = useAuth();
  const { toast } = useToast();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Get user details from Google
        const userInfoResponse = await fetch(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );
        const userInfo = await userInfoResponse.json();
        
        // Create user object
        const user = {
          id: userInfo.sub,
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture,
          accessToken: tokenResponse.access_token,
        };
        
        // Save user to context
        login(user);
      } catch (error) {
        console.error('Error during Google login:', error);
        toast({
          title: 'Login Failed',
          description: 'There was an error logging in with Google.',
          variant: 'destructive',
        });
      }
    },
    onError: (errorResponse) => {
      console.error('Google Login Error:', errorResponse);
      toast({
        title: 'Login Failed',
        description: 'There was an error logging in with Google.',
        variant: 'destructive',
      });
    },
    scope: 'email profile https://www.googleapis.com/auth/calendar',
  });

  return (
    <Button 
      onClick={() => handleGoogleLogin()} 
      className="w-full"
      variant="outline"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="mr-2">
        <path
          fill="currentColor"
          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
        />
      </svg>
      Continue with Google
    </Button>
  );
}
