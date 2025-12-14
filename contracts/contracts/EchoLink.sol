// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title EchoLink
 * @dev Simple contract to demonstrate offline transaction broadcasting.
 *      Users can update the state 'message' or 'value' via the relay.
 */
contract EchoLink {
    
    event DataUpdated(address indexed sender, string message, uint256 value);

    string public message;
    uint256 public value;

    constructor(string memory _initialMessage) {
        message = _initialMessage;
    }

    function updateData(string memory _message, uint256 _value) external {
        message = _message;
        value = _value;
        emit DataUpdated(msg.sender, _message, _value);
    }
}
