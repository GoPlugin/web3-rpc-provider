<div align="center" id="top">

&#xa0;

</div>
<h1 align="center">Web3 RPC Provider</h1>
<div align="center">
  <a href="https://github.com/GoPlugin/web3-rpc-provider/actions/workflows/node.yml"><img alt="Node.js Test" src="https://github.com/GoPlugin/web3-rpc-provider/actions/workflows/node.yml/badge.svg"/></a>
  &#xa0;
</div>
<br>

## :dart: Introduction

Web3 RPC Provider offers the apis of get the free endpoint, enabling clients to quickly access blockchain networks.

> [!NOTE]
> Works with [Web3 RPC Proxy](https://github.com/GoPlugin/web3-rpc-proxy) for optimal, stable, and latest block height access to blockchains.

<br>

## :rocket: Deployment

```bash
# Run the image
$ docker run -p 3000:3000 -d lokesh2cool/we3-rpc-provider:tag
```

## :bulb: Usage
The usage is straightforward, just make a request to the following apis.

Get the endpoint of multiple chains
```bash
curl --location --request GET 'http://localhost:3000/endpoints'
```

Query Parameters:

- `chains`: Required
    The chains parameter allows specifying multiple chain ID values.

Get the endpoint of a single chain
```bash
curl --location --request GET 'http://localhost:3000/{{chain}}/endpoints'
```

- `chain`: Required
    Represents the chain ID. fill it in to get the endpoint of the specified chain.

### Common Query Parameters:

- `sources`: Required
    The sources parameter represents the source of the free endpoint. it can be filled in the class name of Picker in the [pickers](src/pickers) folder.

<br>

## :technologist: Development

### Starting Project
```bash
# Clone the project
$ git clone https://github.com/GoPlugin/web3-rpc-provider

# Navigate to the project directory
$ cd web3-rpc-provider

# Install project dependencies
$ pnpm install

# Start the project
$ nvm use 18.17.0
$ npm run start
```

## :busts_in_silhouette: Contribute
If you want to contribute to the Web3 RPC Provider project:

Fix issues: Find and fix issues in the project.
Write documentation: Improve and write relevant documentation for the project.
Write tests: Write and optimize test cases for the project.


<br>
## :memo: License
This project is under license from MIT. For more details, see [the LICENSE file](LICENSE).

Huge thanks to the author @DODOEX 
&#xa0;

<div align="center"><a href="#top">Back to top</a></div>
