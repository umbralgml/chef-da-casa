import { Pressable, Text, View } from 'react-native';

interface Props {
  emoji: string;
  label: string;
  description: string;
  color: string;
  selected: boolean;
  onPress: () => void;
}

export function CookingStyleButton({ emoji, label, description, color, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: selected ? color : '#FFFFFF',
        borderColor: selected ? color : '#E5DDD4',
        borderWidth: selected ? 2 : 1.5,
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        opacity: pressed ? 0.85 : 1,
        shadowColor: selected ? color : '#000',
        shadowOffset: { width: 0, height: selected ? 4 : 1 },
        shadowOpacity: selected ? 0.25 : 0.06,
        shadowRadius: selected ? 8 : 3,
        elevation: selected ? 6 : 2,
      })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 32, marginRight: 14 }}>{emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: '700',
              color: selected ? '#FFFFFF' : '#1A1A1A',
              marginBottom: 2,
            }}
          >
            {label}
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: selected ? 'rgba(255,255,255,0.85)' : '#6B6B6B',
            }}
          >
            {description}
          </Text>
        </View>
        {selected && (
          <Text style={{ fontSize: 20, color: '#FFFFFF', marginLeft: 8 }}>✓</Text>
        )}
      </View>
    </Pressable>
  );
}
