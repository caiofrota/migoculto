import { Device, Group } from "@migoculto/db";
import Expo, { ExpoPushMessage } from "expo-server-sdk";

const expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

function chunkArray(array: any[], chunkSize: number): any[][] {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

export async function sendNotifications(notifications: ExpoPushMessage[]) {
  const chunkedTokens = chunkArray(notifications, 100);
  for (const chunk of chunkedTokens) {
    try {
      const receipts = await expo.sendPushNotificationsAsync(chunk);
      console.info("Push notification receipts:", receipts);
    } catch (error) {
      console.error("Error sending push notifications:", error);
    }
  }
}

export async function sendGroupMessageNotifications(group: Group, to: Device[]) {
  return await sendNotifications(
    to
      .filter((token) => !!token.pushNotificationToken)
      .map((device) => ({
        title: `${group.name}: Tem mensagem pra você! 💌📲`,
        body: `Nova mensagem no grupo ${group.name} recebida. Venha conferir!`,
        data: { type: "group", groupId: group.id },
        to: device.pushNotificationToken as string,
      })),
  );
}

export async function sendInboxMessageNotifications(group: Group, to: Device[]) {
  return await sendNotifications(
    to
      .filter((token) => !!token.pushNotificationToken)
      .map((device) => ({
        title: "Tem alguém querendo te dizer algo! Corre aqui! 🤪🤓",
        body: `Você recebeu uma mensagem privada do grupo ${group.name}.`,
        data: { type: "inbox", groupId: group.id },
        to: device.pushNotificationToken as string,
      })),
  );
}

export async function sendGroupLeavingNotifications(group: Group, name: string, to: Device[]) {
  return await sendNotifications(
    to
      .filter((token) => !!token.pushNotificationToken)
      .map((device) => ({
        title: "Oh não! Vamos sentir falta! 🥹🥲",
        body: `${name} deixou grupo "${group.name}".`,
        data: { type: "group", groupId: group.id },
        to: device.pushNotificationToken as string,
      })),
  );
}

export async function sendGroupJoiningNotifications(group: Group, name: string, to: Device[]) {
  return await sendNotifications(
    to
      .filter((token) => !!token.pushNotificationToken)
      .map((device) => ({
        title: "Tem um novo MigOculto na área! 🎉🎊",
        body: `Uau! Boas-vindas para ${name}. Mais um MigOculto se juntou ao grupo "${group.name}".`,
        data: { type: "group", groupId: group.id },
        to: device.pushNotificationToken as string,
      })),
  );
}

export async function sendGroupDrawnNotifications(group: Group, to: Device[]) {
  return await sendNotifications(
    to
      .filter((token) => !!token.pushNotificationToken)
      .map((device) => ({
        title: "O grande dia chegou! 🎉🤫",
        body: `O sorteio do MigOculto do grupo "${group.name}" foi realizado! Confira quem é seu amigo oculto!`,
        data: { type: "group", groupId: group.id },
        to: device.pushNotificationToken as string,
      })),
  );
}

export async function sendCloseGroupNotifications(group: Group, to: Device[]) {
  return await sendNotifications(
    to
      .filter((token) => !!token.pushNotificationToken)
      .map((device) => ({
        title: "O grupo foi encerrado! 🎉✅",
        body: `O grupo "${group.name}" foi encerrado com sucesso. Obrigado por participar!`,
        data: { type: "group", groupId: group.id },
        to: device.pushNotificationToken as string,
      })),
  );
}

export async function sendRemoveMemberNotifications(group: Group, to: Device[]) {
  return await sendNotifications(
    to
      .filter((token) => !!token.pushNotificationToken)
      .map((device) => ({
        title: "Você foi removido do grupo! 😔👋",
        body: `Infelizmente você foi removido do grupo "${group.name}". Se quiser, você pode criar um novo grupo e convidar seus amigos!`,
        data: { type: "group", groupId: group.id },
        to: device.pushNotificationToken as string,
      })),
  );
}

export async function sendWishlistUpdateNotifications(group: Group, name: string, to: Device[]) {
  return await sendNotifications(
    to
      .filter((token) => !!token.pushNotificationToken)
      .map((device) => ({
        title: "Lista de presentes atualizada! 🎁🎉",
        body: `${name} atualizou sua lista de desejos no grupo "${group.name}". Dê uma olhada para ver as novidades!`,
        data: { type: "group", groupId: group.id },
        to: device.pushNotificationToken as string,
      })),
  );
}

export async function sendGroupdChangeNotifications(group: Group, to: Device[]) {
  return await sendNotifications(
    to
      .filter((token) => !!token.pushNotificationToken)
      .map((device) => ({
        title: "Detalhes do grupo atualizados! 📝🔄",
        body: `Os detalhes do grupo "${group.name}" foram alterados. Confira as novas informações!`,
        data: { type: "group", groupId: group.id },
        to: device.pushNotificationToken as string,
      })),
  );
}

export async function sendInviteFriendReminderNotifications(group: Group, to: Device[]) {
  return await sendNotifications(
    to
      .filter((token) => !!token.pushNotificationToken)
      .map((device) => ({
        title: "Convide seus amigos para o MigOculto! 🎉🤗",
        body: `Não esqueça de convidar mais amigos para o grupo "${group.name}". Quanto mais, melhor!`,
        data: { type: "group", groupId: group.id },
        to: device.pushNotificationToken as string,
      })),
  );
}

export async function sendDrawReminderNotifications(group: Group, to: Device[]) {
  return await sendNotifications(
    to
      .filter((token) => !!token.pushNotificationToken)
      .map((device) => ({
        title: "Lembrete de sorteio do MigOculto! 🎉🎁",
        body: `A empolgação está no ar! Não se esqueça de realizar o sorteio do grupo "${group.name}". As expectativas estão altas!`,
        data: { type: "group", groupId: group.id },
        to: device.pushNotificationToken as string,
      })),
  );
}

export async function sendEventReminderNotifications(group: Group, to: Device[]) {
  return await sendNotifications(
    to
      .filter((token) => !!token.pushNotificationToken)
      .map((device) => ({
        title: "Lembrete do evento do MigOculto! 🎉📅",
        body: `O grande dia está chegando! Não se esqueça do evento do grupo "${group.name}". Prepare-se para muita diversão e surpresas!`,
        data: { type: "group", groupId: group.id },
        to: device.pushNotificationToken as string,
      })),
  );
}

export async function sendWishlistItemReminderNotifications(group: Group, to: Device[]) {
  return await sendNotifications(
    to
      .filter((token) => !!token.pushNotificationToken)
      .map((device) => ({
        title: "Lembrete de itens na lista de desejos! 🎁📝",
        body: `Não se esqueça de conferir os itens na sua lista de desejos do grupo "${group.name}". Quem sabe você encontra algo especial!`,
        data: { type: "group", groupId: group.id },
        to: device.pushNotificationToken as string,
      })),
  );
}
