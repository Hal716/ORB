import { useProfilePicture } from '@/hooks/ChangeProfPic';
import { useUser } from '@clerk/expo';
import { Text } from 'react-native';
import { Image, TouchableOpacity } from 'react-native';

export default function ProfileScreen() {
  const { user } = useUser();
  const { updateProfilePicture } = useProfilePicture();

  return (
    <TouchableOpacity onPress={updateProfilePicture}>
      <Image 
        source={{ uri: user?.imageUrl }} 
        style={{ width: 100, height: 100, borderRadius: 50 }}
      />
      <Text>Change Photo</Text>
    </TouchableOpacity>
  );
}