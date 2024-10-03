export interface GovernanceInfo {
    proposal_id: string;
    num_votes: number;
    should_pass: boolean;
    staking_pool_address: string;
    transaction_timestamp: string;
    transaction_version: number;
    voter_address: string;
}