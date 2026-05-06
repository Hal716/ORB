import * as ImagePicker from 'expo-image-picker';
import { useUser } from '@clerk/expo';
import { Alert } from 'react-native';

export function useProfilePicture() {
  const { user } = useUser();

  const updateProfilePicture = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission to access gallery is required');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        // eslint-disable-next-line deprecation/deprecation
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) return;

      const imageUri = result.assets[0].uri;
      const fileName = imageUri.split('/').pop() || 'profile.jpg';
      const fileType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';

      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        name: fileName,
        type: fileType,
      } as any);

      await user?.setProfileImage({ file: formData as any });
      Alert.alert('Success', 'Profile picture updated!');
    } catch (error) {
      console.error('Failed to update profile picture:', error);
      Alert.alert('Error', 'Failed to update profile picture');
    }
  };

  return { updateProfilePicture };
}