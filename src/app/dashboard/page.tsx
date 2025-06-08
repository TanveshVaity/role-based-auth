import { auth } from "@clerk/nextjs/server"


export default async function Dashboard() {
    // const data = await auth();
    // console.log(data)
    return (
        <div className="text-white">
            Dashboard
        </div>
    )
}

