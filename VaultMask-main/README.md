# VaultMask

[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)
[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)

<p align="center">
    <img src="https://github.com/MumukshTayal/Inter-IIT-Project_files/blob/add_file_ethereum/vaultmask_logo-01.png" alt="VaultMask Logo">
</p>

`Vautlmask` is an extension of metamask that focusses on **decentralized** storage and improving the **user experience**.

## Table Of Contents

- [Quick Start](#quick-start)
- [Features](#features)
  - [Storage](#storage)
  - [Notifications](#notifications)
- [Workflow](#workflow)
- [Demo](#demo)
- [File Sharing](#file-sharing)
- [Future possibilities](#future-possibilities)

## Quick Start

Follow these steps to run the snap on your system:

- Clone the repo.
- Go to the Hardhat folder and add .env file. Export the private key from your Metamask Flask account and add it to the .env file. Following is an example:

`PRIVATE_KEY = '93890b27049e34dc1c9b954d76c8c366b9aa4349b46bc33391e2bdcb8348ac86'`.

Attention: The information above is intended for illustration purposes only. Never disclose your private keys to anyone.

- In the Hardhat folder:

  - Run `yarn install`

- In the VaultMask folder:
  - Run `yarn install`
  - Run `yarn start`

`Note: To run this snap, you must be on the Hyperspace testnest and have some tFIL in your account.`

Go to the [Hyperspace testnet faucet](https://hyperspace.yoga/#faucet), and paste in your Ethereum address. This will send some hyperspace testnet FIL to the account.


## Features

### Storage

The primary function of vaultmask is storage. It has two kinds of storage option depending upon the user requirement:

**Snaps Storage**

- Personal data
- Upload upto 100 MB of data
- Retrieve data
- Ease of Access
- functions: `get, update, clear`

**Filecoin Storage**

- Data Storage
  - stored in smart contract
  - add address to share
- IPFS Protocol - Secure
- Store unlimited data
- Retrieve data
- functions: `add_record, get_record`

### Notifications

The secondary function of vaultmask is storage. It has two kinds of storage option depending upon the user requirement:

**Push Notifications**

- Push protocol
- Notify in snap
- Regular updates from subscribed channel
- functions: `push_notification`

**Custom Messages**

- Popup with custom text
- Transaction with confirmation texts
- User-friendly

## Workflow

![workflow](https://github.com/MumukshTayal/Inter-IIT-Project_files/blob/add_file_ethereum/vautmask_flow.png)

- Snaps component: Vaultmask can store the data on snaps storage and get the data on demand. It also has a function to clear data.
- Filecoin storage component: Vaultmask uploads files to web3.storage and a cid hash is generated. It is later stored in smart contract with the filename and other transaction information. We can retrieve the file information and user related data using the methods present in smart contract.
- Push notifications are shown whenever a channel updates something. It uses push protocol.
- For improved user experience during the transactions, Vaultmask can show custom messages during pop ups and confirmations.

## Demo
![website](https://github.com/Blockchain-Web3-Group-IIT-Gandhinagar/VaultMask/blob/main/images/2.png)
Following is our demonstration of the snap:
[Demo](https://drive.google.com/file/d/1lIwFjRsEJBubV9La7xpzdfmTPpGEEZd2/view)

## File Sharing
To perform file sharing:
- Upload the file and submit. It will load for a few moments before MetaMask pops up.
![upload and submit](https://github.com/Blockchain-Web3-Group-IIT-Gandhinagar/VaultMask/blob/main/images/1.png)
- As you can see, the file is added in table.
![table](https://github.com/Blockchain-Web3-Group-IIT-Gandhinagar/VaultMask/blob/main/images/3.png)
- Afterwads, enter the address of the account that you want the file to be shared with. Click on the file you want to share.
![sharing](https://github.com/Blockchain-Web3-Group-IIT-Gandhinagar/VaultMask/blob/main/images/4.png)

## Future possibilities

The future possibilities of a general purpose storage snap like this is limitless. It can be used in decentralized data marketplaces, improved data management and decentralized data analytics. We believe in the vast potential of vaultmask and will be exploring new features and possibilities in future.

