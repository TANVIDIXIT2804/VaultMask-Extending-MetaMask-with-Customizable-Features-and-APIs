import { useContext, useState } from 'react';
import * as PushAPI from '@pushprotocol/restapi';
import styled, { useTheme } from 'styled-components';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import { connectSnap, getThemePreference, getSnap, sendHello, showNotifications } from '../utils';
import { HeaderButtons, SendHelloButton, ShowNotificationsButton } from './Buttons';
import { Toggle } from './Toggle';
import { SnapLogo } from './SnapLogo';
import { Dropdown, IconButton } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import GearIcon from '@rsuite/icons/Gear';
import NoticeIcon from '@rsuite/icons/Notice';
import ImageIcon from '@rsuite/icons/Image';
var Web3 = require('web3');
const HeaderWrapper = styled.header`
display: flex;
flex-direction: row;
justify-content: space-between;
align-items: center;
padding: 2.4rem;
border-bottom: 1px solid ${(props) => props.theme.colors.border.default};
`;

const Spacer = styled.div`
  background-color: ${({ theme }) => theme.colors.card.default};
  border: 1px solid ${({ theme }) => theme.colors.card.default};
  color: ${({ theme }) => theme.colors.text.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 1rem;
  margin-top: 0.1rem;
  margin-bottom: 0.1rem;
  max-width: 2rem;
  width: 100%;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    margin-bottom: 1.2rem;
    padding: 1.6rem;
  }
`;

const handleSendHelloClick = async () => {
  try {
    await sendHello();
  } catch (e) {
    console.error(e);
  }
};
const renderIconButton = (props, ref) => {
  return (
    <IconButton {...props} ref={ref} icon={<GearIcon />} circle color="blue" appearance="defualt  " />
  );
};

const Title = styled.p`
  font-size: ${(props) => props.theme.fontSizes.title};
  font-weight: bold;
  margin: 0;
  margin-left: 1.2rem;
  ${({ theme }) => theme.mediaQueries.small} {
    display: none;
  }
`;

const LogoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;



export const Header = ({
  handleToggleClick,
}: {
  handleToggleClick(): void;
}) => {
  const theme = useTheme();
  const [state, dispatch] = useContext(MetaMaskContext);
  const [address, setAddress] = useState('');
  const [userDeals, setuserDeals] = useState<any[]>([]);

  const handleShowNotificationsClick = async () => {
    try {
      await showNotifications();
      await fetchNotifications();
      // await fetchNotifications();
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  async function getUserAddress() {
    try {
      window.ethereum
        .request({
          method: 'wallet_enable',
          // This entire object is ultimately just a list of requested permissions.
          // Every snap has an associated permission or permissions, given the prefix `wallet_snap_`
          // and its ID. Here, the `wallet_snap` property exists so that callers don't
          // have to specify the full permission permission name for each snap.
          params: [
            {
              wallet_snap: {
                'npm:@metamask/example-snap': {},
                'npm:fooSnap': {
                  // The optional version argument allows requesting
                  // SemVer version range, with semantics same as in
                  // package.json ranges.
                  version: '^1.0.2',
                },
              },
              eth_accounts: {},
            },
          ],
        })
        .then((res) => {
          if ((res as { accounts: string[] }) !== null) {
            setAddress((res as { accounts: string[] }).accounts[0]);
          }
        });
    } catch (error) {
      // The `wallet_enable` call will throw if the requested permissions are
      // rejected.
      if (error.code === 4001) {
        console.log('The user rejected the request.');
      } else {
        console.log('Unexpected error:', error);
      }
    }
  }

  async function fetchNotifications(): Promise<string> {
    if (address === '') {
      await getUserAddress();
    }
    console.log(`eip155:5:${address}`);
    const fetchedNotifications = await PushAPI.user.getFeeds({
      user: `eip155:5:${address}`,
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
    console.log(msg);
    return msg;
  }


  const handleConnectClick = async () => {
    try {
      await connectSnap();
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };
  return (
    <HeaderWrapper>
      <LogoWrapper>
        <Title>VaultMask</Title>
      </LogoWrapper>
      <RightContainer>
        <ShowNotificationsButton
          onClick={handleShowNotificationsClick}
          disabled={!state.installedSnap}
        />
        <Spacer></Spacer>
        <SendHelloButton
          onClick={handleSendHelloClick}
          disabled={!state.installedSnap}
        />
        <Spacer></Spacer>
        <HeaderButtons state={state} onConnectClick={handleConnectClick} />
        <Spacer></Spacer>
        <Dropdown renderToggle={renderIconButton} placement="bottomEnd" >
          <Dropdown.Item icon={<ImageIcon />}>
            Change Theme
            <Toggle
              onToggle={handleToggleClick}
              defaultChecked={getThemePreference()}
            />
          </Dropdown.Item>
          <Dropdown.Item icon={<NoticeIcon />} onSelect={handleShowNotificationsClick}>
            Get Notifications
          </Dropdown.Item>
        </Dropdown>
      </RightContainer>
    </HeaderWrapper>

  );
};
