import { gql } from "apollo-boost";

export const SelectChampMutation = gql`
    mutation selectChamp($input: SelectChampInput) {
        selectChamp(input: $input)
    }
`

export type SelectChampMutationResponse = {
    selectChamp: boolean
}