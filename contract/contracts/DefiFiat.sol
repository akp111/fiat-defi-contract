//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./ReentrancyGuard.sol";
// import "hardhat/console.sol";
import "./IWETHGateway.sol";
import "./ILendingPoolAddressesProvider.sol";
import "./IERC20.sol";

contract DefiFiat {
  address public lendingPoolProviderAddress;
  address public ethGateWayAddress;
  address public aMaticAddress;
  address public admin;

  string public name = "Fiat Defi";
  bytes32 public constant DOMAIN_TYPEHASH =
    keccak256(
      "EIP712Domain(string name,uint256 chainId,address verifyingContract)"
    );
  bytes32 public constant LEND_TO_AAVE_TYPEHASH =
    keccak256("Data(address wallet,uint256 expiry)");

  constructor(
    address _lendingPoolProviderAddress,
    address _ethGateWayAddress,
    address _aMaticAddress
  ) {
    lendingPoolProviderAddress = _lendingPoolProviderAddress;
    ethGateWayAddress = _ethGateWayAddress;
    aMaticAddress = _aMaticAddress;
    admin = msg.sender;
  }

  modifier onlyAdmin() {
    require(msg.sender == admin, "ONLY_ADMIN");
    _;
  }

  function getChainId() internal view returns (uint256) {
    uint256 chainId;
    assembly {
      chainId := chainid()
    }
    return chainId;
  }

  function lendToAave(
    uint8 v,
    bytes32 r,
    bytes32 s,
    address wallet,
    uint256 expiry
  ) public payable onlyAdmin {
    bytes32 domainSeparator = keccak256(
      abi.encode(
        DOMAIN_TYPEHASH,
        keccak256(bytes(name)),
        getChainId(),
        address(this)
      )
    );
    bytes32 structHash = keccak256(abi.encode(LEND_TO_AAVE_TYPEHASH, wallet, expiry));
    bytes32 digest = keccak256(
      abi.encodePacked("\x19\x01", domainSeparator, structHash)
    );
    address signatory = ecrecover(digest, v, r, s);
    require(signatory == wallet, "Invalid signer");
    _lendToAave(msg.value, wallet);
  }

  function _lendToAave(uint256 _amount, address _user) private {
    // Initialise the ETHGateway Contract
    IWETHGateway ethGateWay = IWETHGateway(ethGateWayAddress);
    // Initialise the LendingPoolAddressesProvider Contract
    ILendingPoolAddressesProvider lendingProvider = ILendingPoolAddressesProvider(
        lendingPoolProviderAddress
      );
    // console.log(lendingProvider.getLendingPool());
    // Lend the matic tokens to the Aave Protocol.
    ethGateWay.depositETH{ value: _amount }(
      // Address of Lending Pool
      lendingProvider.getLendingPool(),
      // The address that would receive the aToken, in this case the contract
      _user,
      // Referal Code: For now its 0
      0
    );
  }
}
