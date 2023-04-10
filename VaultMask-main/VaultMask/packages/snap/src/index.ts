/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsdoc/require-jsdoc */
import * as PushAPI from '@pushprotocol/restapi';
import { OnRpcRequestHandler } from '@metamask/snap-types';

/**
 * Get a message from the origin. For demonstration purposes only.
 *
 * @param originString - The origin string.
 * @returns A message based on the origin.
 */
export const getMessage = (originString: string): string =>
  `Hello, ${originString}!`;

async function fetchNotifications(addr: string): Promise<string> {
  const fetchedNotifications = await PushAPI.user.getFeeds({
    user: `eip155:5:${addr}`,
    env: 'staging',
  });
  let msg;
  // Parse the notification fetched
  if (fetchedNotifications) {
    msg = `You have ${fetchedNotifications.length} notifications\n`;
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < fetchedNotifications.length; i++) {
      msg += `${fetchedNotifications[i].title} ${fetchedNotifications[i].message}\n`;
    }
  } else {
    msg = 'You have 0 notifications';
  }
  return msg;
}

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns `null` if the request succeeded.
 * @throws If the request method is not valid for this snap.
 * @throws If the `snap_confirm` call failed.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  // const addr = wallet.selectedAddress;

  switch (request.method) {
    case 'hello':
      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: getMessage(origin),
            description:
              'This custom confirmation is just for display purposes.',
            textAreaContent:
              'This is a custom message confirmation for the demonstration purposes.',
          },
        ],
      });
    case 'upload':
      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: getMessage(origin),
            description: 'Inside Snap/src/index.ts',
            textAreaContent: 'You Uploaded a file',
          },
        ],
      });
    case 'upload_file':
      const params = request.params as { filename: string, cid: string };
      return wallet.request({
        method: 'snap_manageState',
        params: [
          'update', { filename: params.filename, cid: params.cid },
        ],
      });
      

    case 'get_file':
      return wallet.request({
        method: 'snap_manageState',
        params: [
          'get'
        ],
      });

    case 'push_notifications': {
      const msg = await fetchNotifications(
        '0x8e1cc3148a6D10b28859dd2d5e26663b01f64E73',
      );
      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: 'Push Notifications',
            description: 'These are the notifications From PUSH.',
            textAreaContent: msg,
          },
        ],
      });
    }

    default:
      throw new Error('Method not found.');
  }
};
