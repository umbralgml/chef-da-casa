import { Pressable, Text, View } from 'react-native';

interface Props {
  label: string;
  onRemove: () => void;
}

export function IngredientTag({ label, onRemove }: Props) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF3EE',
        borderColor: '#E8622A',
        borderWidth: 1,
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginRight: 8,
        marginBottom: 8,
      }}
    >
      <Text style={{ color: '#E8622A', fontSize: 14, fontWeight: '500', marginRight: 6 }}>
        {label}
      </Text>
      <Pressable onPress={onRemove} hitSlop={8}>
        <Text style={{ color: '#E8622A', fontSize: 16, fontWeight: '700', lineHeight: 18 }}>×</Text>
      </Pressable>
    </View>
  );
}
