//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.10;

contract ToDoList {

    uint public taskCount = 0;

    struct Task {
        uint id;
        string content;
        bool completed;
    }

    mapping(uint => Task) public tasks;

    constructor() {
        createTask("Thank you for choosing our ToDo App!");
    }

    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);
    }

}