import { ethers, JsonRpcSigner } from "ethers";

interface Task {
    id: number;
    content: string;
    completed: boolean;
}

declare global {
    export interface Window {
        ethereum?: any;
    }
}

export class ContractCall {
    private contractAddress: string;
    private contractABI: any;
    private provider: ethers.BrowserProvider | null = null;
    private signer: JsonRpcSigner | null = null;
    private contract: ethers.Contract | null = null;

    constructor(contractAddress: string, contractABI: any) {
        this.contractAddress = contractAddress;
        this.contractABI = contractABI;
        this.connectToMetaMask();
    }

    private async connectToMetaMask() {
        if (!window.ethereum) {
            throw new Error("Metamask not found");
        }

        this.provider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await this.provider.getSigner();
        this.setContract();
    }

    private setContract() {
        if (!this.signer) {
            throw new Error("Signer not initialized");
        }
        
        this.contract = new ethers.Contract(
            this.contractAddress,
            this.contractABI,
            this.signer
        );
    }

    public async getTaskCount(): Promise<number> {
        if (!this.contract) {
            throw new Error("Contract not initialized");
        }
        
        const count = await this.contract.taskCount();
        return Number(count);
    }

    public async createTask(content: string): Promise<void> {
        if (!this.contract) {
            throw new Error("Contract not initialized");
        }
        
        const tx = await this.contract.createTask(content);
        await tx.wait();
    }

    public async getTask(taskId: number): Promise<Task> {
        if (!this.contract) {
            throw new Error("Contract not initialized");
        }
        
        const task = await this.contract.tasks(taskId);
        return {
            id: Number(task.id),
            content: task.content,
            completed: task.completed
        };
    }

    public async getAllTasks(): Promise<Task[]> {
        if (!this.contract) {
            throw new Error("Contract not initialized");
        }
        
        const count = await this.getTaskCount();
        const tasks: Task[] = [];
        
        for (let i = 1; i <= count; i++) {
            const task = await this.getTask(i);
            tasks.push(task);
        }
        
        return tasks;
    }

    public async isConnected(): Promise<boolean> {
        return this.contract !== null;
    }

    public async requestAccountAccess(): Promise<void> {
        if (!window.ethereum) {
            throw new Error("Metamask not found");
        }
        
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    }
}