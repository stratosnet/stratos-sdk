[Stratos SDK](../README.md) / [Exports](../modules.md) / [networkTypes](../modules/networkTypes.md) / RpcStatusResponse

# Interface: RpcStatusResponse

[networkTypes](../modules/networkTypes.md).RpcStatusResponse

## Table of contents

### Properties

- [result](networkTypes.RpcStatusResponse.md#result)

## Properties

### result

• **result**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `node_info` | \{ `channels`: `string` ; `id`: `string` ; `listen_addr`: `string` ; `moniker`: `string` ; `network`: `string` ; `protocol_version`: \{ `app`: `string` ; `block`: `string` ; `p2p`: `string`  } ; `version`: `string`  } |
| `node_info.channels` | `string` |
| `node_info.id` | `string` |
| `node_info.listen_addr` | `string` |
| `node_info.moniker` | `string` |
| `node_info.network` | `string` |
| `node_info.protocol_version` | \{ `app`: `string` ; `block`: `string` ; `p2p`: `string`  } |
| `node_info.protocol_version.app` | `string` |
| `node_info.protocol_version.block` | `string` |
| `node_info.protocol_version.p2p` | `string` |
| `node_info.version` | `string` |
| `sync_info` | \{ `latest_app_hash`: `string` ; `latest_block_hash`: `string` ; `latest_block_height`: `string` ; `latest_block_time`: `string`  } |
| `sync_info.latest_app_hash` | `string` |
| `sync_info.latest_block_hash` | `string` |
| `sync_info.latest_block_height` | `string` |
| `sync_info.latest_block_time` | `string` |
| `validator_info?` | \{ `address`: `string` ; `voting_power`: `string`  } |
| `validator_info.address` | `string` |
| `validator_info.voting_power` | `string` |

#### Defined in

services/network/types.ts:370
