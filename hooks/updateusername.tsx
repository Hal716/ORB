import { useUser } from '@clerk/expo';
import { useState } from 'react';
import { Alert } from 'react-native';

export function useUpdateUsername() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const updateUsername = async (newUsername: string) => {
    if (!newUsername.trim()) {
      Alert.alert('Error', 'Username cannot be empty');
      return;
    }

    try {
      setIsLoading(true);
      await user?.update({ username: newUsername.trim() });
      Alert.alert('Success', 'Username updated!');
    } catch (error: any) {
      console.error('Failed to update username:', error);
      Alert.alert('Error', error?.errors?.[0]?.message || 'Failed to update username');
    } finally {
      setIsLoading(false);
    }
  };

  return { updateUsername, isLoading };
}