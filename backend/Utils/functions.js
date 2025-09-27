import mongoose  from "mongoose"

export async function getCount( UserModel, choiceId){
    const count = await UserModel.aggregate(
        [
            {
                $match: {
                    choiceId: {
                        $eq: choiceId
                    }
                }
            },
            {
                $count: "choiceId"
            }
        ]
    )

    return count
}