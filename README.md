# FilaZero

Aplicativo Expo (React Native) que usa Supabase Realtime para receber chamadas de
senha e exibi-las como notificações locais com Expo Notifications.

## Como rodar

1. Crie um projeto no Supabase e execute o arquivo `supabase_setup.sql` no
   **SQL Editor**.

2. As credenciais do projeto ficam em `src/services/supabase.js`
   (**Project Settings > API**: Project URL e a chave pública).

3. Instale as dependências e inicie o app:

```bash
npm install
npx expo start
ou
npx expo start --clear --tunnel
```

4. Escaneie o QR Code com o Expo Go, aceite a permissão de notificações,
   informe a senha e o local de atendimento e toque em **CHAMAR SENHA**.
   Todos os aparelhos conectados recebem a notificação na hora.
