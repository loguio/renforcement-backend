import { ScrollView } from "react-native";
import { Card, Text } from "react-native-paper";

export default function SinistreDetailScreen() {
  // implémenter un state local pour charger le sinistre localement

  // récupérer le paramètre d'URL

  // fetch récupérer le sinistre courant

  return (
    <ScrollView>
      <Card>
        <Card.Title title="Mon sinistre" />
        <Card.Content>
          <Text>contenu</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}
