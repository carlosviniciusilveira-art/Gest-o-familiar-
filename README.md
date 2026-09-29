# Gestão Familiar

Aplicativo web para controle de recebimentos e contas.

## Rodar localmente

```bash
npm install
npm run dev
```

Depois acesse http://localhost:3000

## Publicar na Vercel

1. Crie um repositório no GitHub.
2. Envie todos os arquivos deste projeto para o repositório.
3. Na Vercel, escolha **Add New Project**.
4. Importe o repositório do GitHub.
5. Clique em **Deploy**.

Não são necessárias variáveis de ambiente para esta primeira versão.

## Observação

Os lançamentos desta primeira versão ficam salvos no `localStorage` do navegador/dispositivo. Isso permite testar e publicar sem banco de dados. Para sincronização entre celulares/computadores, o próximo passo é conectar um banco de dados.
