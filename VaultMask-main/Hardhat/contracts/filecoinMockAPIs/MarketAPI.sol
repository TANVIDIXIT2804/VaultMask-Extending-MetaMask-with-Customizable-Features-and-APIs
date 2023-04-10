// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.4.25 <=0.8.17;

contract MarketAPI {
    mapping(address => string[]) public filenamearr;
    mapping(address => string[]) public cidarr;

    function add_record(string memory _filename, string memory _cid, address _address) public {
        filenamearr[_address].push(_filename);
        cidarr[_address].push(_cid);
    }

    function return_size() public view returns (uint256) {
        string[] memory arr = filenamearr[msg.sender];
        uint256 l = arr.length;
        return l;
    }

    function get_filename(uint256 index) public view returns (string memory) {
        string[] memory arr = filenamearr[msg.sender];
        string memory ans = arr[index];
        return ans;
    }

    function get_cid(uint256 index) public view returns (string memory) {
        string[] memory arr = cidarr[msg.sender];
        string memory ans = arr[index];
        return ans;
    }
}
