import { useState } from 'react';
import { Alert, Modal, Pressable, Text, TextInput, View } from 'react-native';
import { useUpdateUsername } from '@/hooks/updateusername';

export function EditUsernameModal({ visible, onClose, currentName }: {
  visible: boolean;
  onClose: () => void;
  currentName: string;
}) {
  const { updateUsername, isLoading } = useUpdateUsername();
  const [newUsername, setNewUsername] = useState(currentName);

  const handleSave = async () => {
    await updateUsername(newUsername);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-btest w-full rounded-2xl p-6">
          <Text className="auth-title mb-4">Edit Username</Text>
          <TextInput
            className="auth-input"
            value={newUsername}
            onChangeText={setNewUsername}
            placeholder="Enter new username"
            autoFocus
          />
          <View className="flex-row gap-3 mt-4">
            <Pressable
              className="auth-secondary-button flex-1"
              onPress={onClose}
            >
              <Text className="auth-secondary-button-text">Cancel</Text>
            </Pressable>
            <Pressable
              className="auth-button flex-1"
              onPress={handleSave}
              disabled={isLoading}
            >
              <Text className="auth-button-text">
                {isLoading ? 'Saving...' : 'Save'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}