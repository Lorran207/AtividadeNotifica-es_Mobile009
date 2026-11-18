import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { supabase } from './src/services/supabase';
import {
  registerForLocalNotificationsAsync,
  triggerLocalNotification,
} from './src/helper/notificationsHelper';

function MainApp() {
  const [senha, setSenha] = useState('');
  const [local, setLocal] = useState('');
  const [loading, setLoading] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [realtimeStatus, setRealtimeStatus] = useState('CONECTANDO');

  useEffect(() => {
    registerForLocalNotificationsAsync()
      .then(setPermissionGranted)
      .catch(() => setPermissionGranted(false));

    const subscription = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          triggerLocalNotification(payload.new.title, payload.new.body);
        }
      )
      .subscribe((status) => setRealtimeStatus(status));

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const callPassword = async () => {
    if (!senha.trim() || !local.trim()) {
      Alert.alert('Atenção', 'Informe a senha e o local de atendimento.');
      return;
    }

    const senhaFormatada = senha.trim().toUpperCase();
    const localFormatado = local.trim();

    setLoading(true);

    const { error } = await supabase.from('notifications').insert([
      {
        title: `Senha ${senhaFormatada}`,
        body: `Atendimento em: ${localFormatado}`,
      },
    ]);

    setLoading(false);

    if (error) {
      Alert.alert('Erro ao chamar', error.message);
    } else {
      Alert.alert(
        'Senha chamada',
        `Senha ${senhaFormatada} enviada para todos os clientes conectados.`
      );
      setSenha('');
      setLocal('');
    }
  };

  const isConnected = realtimeStatus === 'SUBSCRIBED';

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.header}>🎫 FilaZero</Text>
        <Text style={styles.subtitle}>Chamada de senhas em tempo real</Text>

        <View style={styles.statusContainer}>
          <Text style={styles.label}>Status da Conexão:</Text>
          <Text
            style={{
              color: isConnected ? 'green' : 'orange',
              fontWeight: 'bold',
            }}
          >
            {isConnected ? '🟢 Escutando chamadas...' : `🟠 ${realtimeStatus}`}
          </Text>
          <Text style={styles.hint}>
            {permissionGranted
              ? 'Notificações permitidas'
              : 'Notificações sem permissão'}
          </Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.subHeader}>Área do Atendente</Text>
        <Text style={styles.sectionHint}>
          A senha chamada aqui chega na hora para todos os clientes conectados.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Senha (ex: A-042)"
          value={senha}
          onChangeText={setSenha}
          autoCapitalize="characters"
          maxLength={10}
        />
        <TextInput
          style={styles.input}
          placeholder="Local de atendimento (ex: Guichê 3)"
          value={local}
          onChangeText={setLocal}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#00796B" />
        ) : (
          <Button
            title="CHAMAR SENHA"
            color="#00796B"
            onPress={callPassword}
          />
        )}
      </ScrollView>
    </View>
  );
}

export default function App() {
  return <MainApp />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 50 },
  scroll: { padding: 20 },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginTop: 4,
    marginBottom: 20,
  },
  statusContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  label: { fontSize: 14, color: '#666' },
  hint: { fontSize: 12, color: '#999', marginTop: 4 },
  divider: { height: 1, backgroundColor: '#ccc', marginVertical: 20 },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00796B',
    marginBottom: 6,
  },
  sectionHint: {
    fontSize: 13,
    color: '#666',
    marginBottom: 14,
    lineHeight: 18,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
});
