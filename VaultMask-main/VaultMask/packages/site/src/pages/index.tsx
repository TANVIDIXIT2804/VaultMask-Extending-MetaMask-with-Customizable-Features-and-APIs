/* eslint-disable import/no-extraneous-dependencies */
import * as PushAPI from '@pushprotocol/restapi';
import { ChangeEvent, useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Web3Storage } from 'web3.storage';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import {
  connectSnap,
  getSnap,
  sendHello,
  shouldDisplayReconnectButton,
  showNotifications,
  sendContractTransaction,
  uploadFile,
  storeFile,
  getSnapFile,
} from '../utils';
import {
  ConnectButton,
  InstallFlaskButton,
  GetFileButton,
  UploadFileInput,
  UploadFileContent,
  ReconnectButton,
  SendHelloButton,
  SendTxButton,
  Card,
  Push,
  ShowNotificationsButton,
  RecScreenButton,

} from '../components';
import DataTable from '../components/Table';
import MarketAPI from '../components/MarketAPI.json';
const { ethers } = require('ethers');

// const TOKEN = process.env.WEB3_STORAGE_API_KEY;
const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDA0YTY5ZWU2ZTY5NjdFMDJkYTkwN2EwZUQ3ZjJBOTIwNEI0OWNCODkiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzAwMzI0MDk4MzcsIm5hbWUiOiJUZXN0IHdlYjMuc3RvcmFnZSJ9.YrEPVX06nlNs_9gEqHZCi2Czux84Kr-Iysrz-coWALc';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin-top: 7.6rem;
  margin-bottom: 7.6rem;
  ${({ theme }) => theme.mediaQueries.small} {
    padding-left: 2.4rem;
    padding-right: 2.4rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
  }
`;

const Heading = styled.h1`
  margin-top: 0;
  margin-bottom: 2.4rem;
  text-align: center;
`;

const Span = styled.span`
  color: ${(props) => props.theme.colors.primary.default};
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 90rem;
  width: 100%;
  height: 100%;
  margin-top: 1.5rem;
`;
const Notice = styled.div`
  background-color: ${({ theme }) => theme.colors.background.alternative};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  margin-bottom: 2.4rem;
  max-width: 60rem;
  width: 60%;

  & > * {
    margin: 0;
  }
  ${({ theme }) => theme.mediaQueries.small} {
    margin-top: 1.2rem;
    margin-bottom: 1.2rem;
    padding: 1.6rem;
  }
`;

const Notice1 = styled.div`
  background-color: ${({ theme }) => theme.colors.card.default};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-top: 2.4rem;
  margin-bottom: 2.4rem;
  max-width: 100rem;
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

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error.muted};
  border: 1px solid ${({ theme }) => theme.colors.error.default};
  color: ${({ theme }) => theme.colors.error.alternative};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 2.4rem;
  margin-bottom: 2.4rem;
  margin-top: 2.4rem;
  max-width: 60rem;
  width: 100%;
  ${({ theme }) => theme.mediaQueries.small} {
    padding: 1.6rem;
    margin-bottom: 1.2rem;
    margin-top: 1.2rem;
    max-width: 100%;
  }
`;

export enum TransactionConstants {
  // The address of an arbitrary contract that will reject any transactions it receives
  Address = '0x08A8fDBddc160A7d5b957256b903dCAb1aE512C5',
  // Some example encoded contract transaction data
  UpdateWithdrawalAccount = '0x83ade3dc00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000200000000000000000000000047170ceae335a9db7e96b72de630389669b334710000000000000000000000006b175474e89094c44da98b954eedeac495271d0f',
  UpdateMigrationMode = '0x2e26065e0000000000000000000000000000000000000000000000000000000000000000',
  UpdateCap = '0x85b2c14a00000000000000000000000047170ceae335a9db7e96b72de630389669b334710000000000000000000000000000000000000000000000000de0b6b3a7640000',
}

////// What are these addresses? MUMUKSH OP
export enum ContractAddresses {
  Uniswap = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
  Storage = '0x0a2C2c75BbF27B45C92E3eF7F7ddFcC0720FDf66',
}
//////////// MUMUKSH OP

const Index = () => {
  const [state, dispatch] = useContext(MetaMaskContext);
  const [address, setAddress] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [userDeals, setuserDeals] = useState<any[]>([]);
  const [uploadedFiles, setuploadedFiles] = useState<File | null>(null);

  useEffect(() => {
    async function checkData() {
      const userDeals = await getUserDeals() || [];
      setuserDeals(userDeals);
      console.log('UserDeals:', userDeals);
    }

    checkData();

    handleStoredFiles();
    
    console.log('Files loaded from Snap');
  }, []);

  const [getFiles, setgetFiles] = useState(Boolean);
  const [filenames, setfilename] = useState([]);
  const [cidvals, setcid] = useState([]);
  const [filedata, setfiledata] = useState<[string, string][]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading1, setsubmitLoading1] = useState(false);
  const [submitLoading2, setsubmitLoading2] = useState(false);

  // useEffect(() => {
  //     async function checkData() {
  //       const userDeals = await getUserDeals();
  //       setuserDeals(userDeals);
  //       console.log('UserDeals:', userDeals);
  //     }

  //     checkData()
  // }, [])


  const handleSendTxClick = async (address: string, data: string) => {
    try {
      await sendContractTransaction(address, data);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };
  console.log('state', state);

  const handleConnectClick = async () => {
    try {
      await connectSnap();
      await getUserAddress();
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

  const handleSendHelloClick = async () => {
    try {
      await sendHello();
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  function jsonFile(filename: string, obj: { path: string; caption?: string }) {
    return new File([JSON.stringify(obj)], filename);
  }

  function makeGatewayURL(cid: string, path: string) {
    return `https://${cid}.ipfs.dweb.link/${encodeURIComponent(path)}`;
  }

  function updateUploadInfo(
    cid: string,
    metadataGatewayURL: string,
    imageGatewayURL: string,
    imageURI: string,
    metadataURI: string,
  ) {
    console.log(cid);
    console.log(metadataGatewayURL);
    console.log(imageGatewayURL);
    console.log(imageURI);
    console.log(metadataURI);
  }

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

  async function getUserDeals() {
    try {
      await (window as any)?.ethereum?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xC45' }],
      });

      const provider = new ethers.providers.Web3Provider(
        (window as any)?.ethereum,
      );
      
      const signer = provider.getSigner(0);
      const marketAPI = new ethers.Contract('0x9e294e5Bde166200a968E67d0a9eEd975f2555AE', MarketAPI.abi, signer);
      console.log('step1', marketAPI);

      const newElements: [string, string][] = [];
      console.log('step2', newElements);

      const arr_length = await marketAPI.return_size();
      console.log('step3', arr_length);
      console.log('get_cid', marketAPI.get_cid(0));
      console.log('get_file', marketAPI.get_filename(0));

      for (let i = 0; i < arr_length; i++) {
        const filenamestr = await marketAPI.get_filename(i);
        const cidval = await marketAPI.get_cid(i);
        // console.log(filenamestr, cidval);

        if (!filedata.some(item => item[0] === filenamestr && item[1] === cidval)) {
          filedata.push([filenamestr, cidval]);
          
        }
      }
      
      console.log('Blockchain stored filedata is here:', filedata);
      console.log("some random shit");
      return filedata;
    } catch (error) {

      console.log(error);
    }
  }

  interface MyStruct {
    file_name: string;
    cid: string;
    size?: number;
    id?: string;
    client?: string;
    provider?: string;
  }

  async function AddNewDeal(_fileName: string, _cid: string) {
    try {
      await (window as any)?.ethereum?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xC45' }],
      });

      console.log('step0');
      const provider = new ethers.providers.Web3Provider((window as any)?.ethereum)
      console.log('step1');
      const signer = provider.getSigner(0);
      console.log('step2');
      const signerAddress = signer.getAddress();
      const marketAPI = new ethers.Contract('0x9e294e5Bde166200a968E67d0a9eEd975f2555AE', MarketAPI.abi, signer);

      console.log('step3', marketAPI);

      let mystruct: MyStruct = {
        file_name: _fileName,
        cid: _cid,
      };

      console.log('step4', mystruct);

      // const newDeal = await marketAPI.add_file(mystruct);

      // const newDeal = await marketAPI.add_file(_cid);

      const newDeal = await marketAPI.add_record(_fileName, _cid, signerAddress);

      console.log('step5', newDeal);

      // .send({ gasPrice: ethers.utils.parseUnits('20', 'gwei') });
      if (newDeal == undefined) {
        console.log(mystruct);
        console.log('NewDeal error');
      }
      return newDeal;
    } catch (error) {
      return error;
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

  const handleFileSelected = async (e: InputEvent) => {
    console.log('handleFileSelected');
    const { files } = e.target as HTMLInputElement;
    if (files === null || files.length < 1) {
      console.log('nothing selected');
      return;
    } else {
      setuploadedFiles(files[0]);
    }
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('handleUpload');
    const namePrefix = 'ImageGallery';

    // handleFileSelected(e.target.files[0])
    try {
      const uploadName = [namePrefix, ''].join('|');
      const web3storage = new Web3Storage({ token: TOKEN });

      if (uploadedFiles) {
        const imageFile = uploadedFiles;
        const metadataFile = jsonFile('metadata.json', {
          path: imageFile.name,
        });

        setsubmitLoading1(true);
        const cid = await web3storage.put([imageFile, metadataFile], {
          // the name is viewable at https://web3.storage/files and is included in the status and list API responses
          name: uploadName,

          onRootCidReady: (localCid: string) => {
            console.log('Local CID: ', localCid);
          },

          onStoredChunk: (bytes: any) =>
            console.log(`sent ${bytes.toLocaleString()} bytes to web3.storage`),
        });

        const uploadNames = [];
        for await (const item of web3storage.list({ maxResults: 10 })) {
          uploadNames.push(item.name);
        }
        console.log(uploadNames);

        const metadataGatewayURL = makeGatewayURL(cid, 'metadata.json');
        const imageGatewayURL = makeGatewayURL(cid, imageFile.name);
        const imageURI = `ipfs://${cid}/${imageFile.name}`;
        const metadataURI = `ipfs://${cid}/metadata.json`;
        updateUploadInfo(
          cid,
          metadataGatewayURL,
          imageGatewayURL,
          imageURI,
          metadataURI,
        );

        console.log('ImageFileName: ', imageFile.name);
        console.log('Type of Image File: ', typeof imageFile.name);
        console.log('Type of CID: ', typeof cid);

        const mint = await AddNewDeal(imageFile.name, cid);
        await uploadFile();
        if (mint !== undefined) {
          console.log('Upload successful:');
          console.log(mint);
          
        }
        setsubmitLoading1(false);
      }
    } catch (err) {
      console.error(err);
      dispatch({ type: MetamaskActions.SetError, payload: err });
    }
  };

  const SnapUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('SnapUpload');
    const namePrefix = 'ImageGallery';

    // handleFileSelected(e.target.files[0])
    try {
      const uploadName = [namePrefix, ''].join('|');
      const web3storage = new Web3Storage({ token: TOKEN });

      if (uploadedFiles) {
        const imageFile = uploadedFiles;
        const metadataFile = jsonFile('metadata.json', {
          path: imageFile.name,
        });
        setsubmitLoading2(true);
        const cid = await web3storage.put([imageFile, metadataFile], {
          // the name is viewable at https://web3.storage/files and is included in the status and list API responses
          name: uploadName,

          onRootCidReady: (localCid: string) => {
            console.log('Local CID: ', localCid);
          },

          onStoredChunk: (bytes: any) =>
            console.log(`sent ${bytes.toLocaleString()} bytes to web3.storage`),
        });

        const uploadNames = [];
        for await (const item of web3storage.list({ maxResults: 10 })) {
          uploadNames.push(item.name);
        }
        console.log(uploadNames);

        const metadataGatewayURL = makeGatewayURL(cid, 'metadata.json');
        const imageGatewayURL = makeGatewayURL(cid, imageFile.name);
        const imageURI = `ipfs://${cid}/${imageFile.name}`;
        const metadataURI = `ipfs://${cid}/metadata.json`;
        updateUploadInfo(
          cid,
          metadataGatewayURL,
          imageGatewayURL,
          imageURI,
          metadataURI,
        );

        interface FileCid {
          filename: string[];
          cid: string[];
        }

        console.log("I am going to receive getSnapFile")
        let filecid = await getSnapFile() as FileCid;
        
        let cidlist: string[] = [];
        let filenamelist: string[] = [];
        if (filecid && filecid.cid && filecid.filename) {
          cidlist = filecid.cid;
          filenamelist = filecid.filename;
          console.log('cidlist: ', cidlist);
          console.log('filenamelist: ', filenamelist);
        }
        cidlist.push(cid);
        filenamelist.push(imageFile.name);

        await storeFile(filenamelist, cidlist);
        let newElements: [string, string][] = filedata;
        for (let i = 0; i < cidlist.length; i++) {
          if(i < filenamelist.length) {
          
            const cidval = cidlist[i];
            const filenamestr = filenamelist[i];
            
            if (!filedata.some(item => item[0] === filenamestr && item[1] === cidval)) {
              filedata.push([filenamestr, cidval]);
              
            }
        }
        }
        setsubmitLoading2(false);
      }
    } catch (err) {
      console.log(err);
      // dispatch({ type: MetamaskActions.SetError, payload: err });
    }
  };

  const handleGetFile = async (event: React.FormEvent<HTMLFormElement>) => {
    // setgetFiles(true);
    event.preventDefault();
    console.log('Get User File');
    try {
      const mint = await getUserDeals();
      if (mint !== undefined) {
        console.log('Fetching');
        console.log(mint);
        console.log(filedata);
        // setgetFiles(false);
      }
    } catch (err) {
      console.error(err);
      dispatch({ type: MetamaskActions.SetError, payload: err });
    }
  };

  const handleStoredFiles = async () => {

    interface FileCid {
      filename: string[];
      cid: string[];
    }

    let filecid = await getSnapFile() as FileCid;
    let blfilecid = await getUserDeals();
    console.log("Loading all files...");

    let cidlist: string[] = [];
    let filenamelist: string[] = [];

    if (filecid && filecid.cid && filecid.filename) {
      cidlist = filecid.cid;
      filenamelist = filecid.filename;
      console.log('cidlist: ', cidlist);
      console.log('filenamelist: ', filenamelist);
    }
    
    if (blfilecid && blfilecid[0] && blfilecid[1]) {
      for (let i = 0; i < blfilecid[0].length; i++) {
        cidlist.push(blfilecid[i][1]);
        filenamelist.push(blfilecid[i][0]);
      }
      
      console.log('cidlist: ', cidlist);
      console.log('filenamelist: ', filenamelist);
    }

    // let newElements: [string, string][] = filedata;
    for (let i = 0; i < cidlist.length; i++) {
      if(i < filenamelist.length){
      const filenamestr = filenamelist[i];
      const cidval = cidlist[i];
      
      if (!filedata.some(item => item[0] === filenamestr && item[1] === cidval)) {
        filedata.push([filenamestr, cidval]);
        
      }
    }
      console.log('These are all loaded files from everywhere. Do check them thoroughly',filedata)
    }
    
    setLoading(false);
  }

  const shareFiles = async (_filename: string, _cid: string) => {
    try {
      await (window as any)?.ethereum?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xC45' }],
      });

      const provider = new ethers.providers.Web3Provider((window as any)?.ethereum)

      const signer = provider.getSigner(0);
      
      const marketAPI = new ethers.Contract('0x9e294e5Bde166200a968E67d0a9eEd975f2555AE', MarketAPI.abi, signer);

      const shareAddress = inputValue;
      await marketAPI.add_record(_filename, _cid, shareAddress);

  }catch(error){
    return error;
  }
  };
  const getInputValue = (event: ChangeEvent) => {
    // show the user input value to console
    const userValue = (event.target as HTMLInputElement).value;
    // const address = ens.getAddress(userValue);
    // console.log(address);

    setInputValue(userValue);
  };
  return (
    <Container>
      <Heading>
        <Span>VaultMask</Span>
      </Heading>
      {address.length > 0 && <Push account={address} />}

      <CardContainer>
        {state.error && (
          <ErrorMessage>
            <b>An error happened:</b> {state.error.message}
          </ErrorMessage>
        )}
        {!state.isFlask && (
          <Card
            content={{
              title: 'Install',
              description:
                'Snaps is pre-release software only available in MetaMask Flask, a canary distribution for developers with access to upcoming features.',
              button1: <InstallFlaskButton />,
            }}
            fullWidth
          />
        )}


        {/* <img src={} alt="logo"/>  */}
        {/* {!state.installedSnap && (
          <Card
            content={{
              title: 'Connect',
              description:
                'Get started by connecting to and installing the example snap.',
              button1: (
                <ConnectButton
                  onClick={handleConnectClick}
                  disabled={!state.isFlask}
                />
              ),
            }}
            disabled={!state.isFlask}
          />
        )}
        {shouldDisplayReconnectButton(state.installedSnap) && (
          <Card
            content={{
              title: 'Reconnect',
              description:
                'While connected to a local running snap this button will always be displayed in order to update the snap if a change is made.',
              button1: (
                <ReconnectButton
                  onClick={handleConnectClick}
                  disabled={!state.installedSnap}
                />
              ),
            }}
            disabled={!state.installedSnap}
          />
        )} */}

        <Card
          content={{
            title: 'Upload file',
            description: 'Upload file to Vault',
            button1: (
              <UploadFileInput
                onChange={handleFileSelected}
                disabled={!state.installedSnap}
              />
            ),
            button2: <UploadFileContent disabled={!state.installedSnap} />,
          }}
          disabled={!state.installedSnap}
          fullWidth={
            state.isFlask &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
          onSubmit={handleUpload}
          loading={submitLoading1}
        />
        <Card
          content={{
            title: 'Snap Store file',
            description: 'Upload file to Snap',
            button1: (
              <UploadFileInput
                onChange={handleFileSelected}
                disabled={!state.installedSnap}
              />
            ),
            button2: <UploadFileContent disabled={!state.installedSnap} />,
          }}
          disabled={!state.installedSnap}
          fullWidth={
            state.isFlask &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
          onSubmit={SnapUpload}
          loading={submitLoading2}
        />
        <Card
          content={{
            title: 'Get File',
            description: 'Get Your Files',
            button1: (
              <GetFileButton
                onClick={handleGetFile}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={false}
        />

        {/* <Notice>
          <p>Description about upload file</p>
        </Notice>
        <Notice>
          <p>Description about record screen</p>
        </Notice> */}
        {/* <Card
          content={{
            title: 'Record Screen',
            description:
              'Click on start to record your screen',
            button1: (
              <RecScreenButton
                onClick={handleSendHelloClick}
                disabled={!state.installedSnap}
              />
            ),
          }}
          disabled={!state.installedSnap}
          fullWidth={
            state.isFlask &&
            Boolean(state.installedSnap) &&
            !shouldDisplayReconnectButton(state.installedSnap)
          }
        /> */}

      </CardContainer>

      {/* <CCard style={{ width: '18rem' }}>

      <CCardImage orientation="top" src="" />

      </CCard> */}
      <DataTable data = {filedata} loading = {loading} funcn = {shareFiles} />
      <Notice>
      <p>Input a valid Address to share a file with. Once entered, press the Share button adjacent to whichever file you want to share.</p>
      </Notice>
      
      <input type="text" id="message" width='100' placeholder='0x...' onChange={getInputValue}/>

      &nbsp;&nbsp;&nbsp;&nbsp;
      <Notice1>
          <p>
            <center>
              <strong>About Us</strong>
            </center>
          </p>
          <p>Description</p>
          <p>.</p>
          <p>.</p>
        </Notice1>
    </Container>
  );
};

export default Index;
