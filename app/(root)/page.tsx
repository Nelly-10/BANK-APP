import HeaderBox from '@/components/HeaderBox';
// import RecentTransactions from '@/components/RecentTransactions';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import { getAccounts, getAccount } from "@/lib/actions/bank.actions";
import RightSidebar from '@/components/RightSidebar';
import { getLoggedInUser } from "@/lib/actions/user.actions";




const Home = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({
    userId: loggedIn.$id
  });
  // console.log("accounts", accounts); { data: [], totalBanks: 0, totalCurrentBalance: 0 }

  if (!accounts) return;
  
  
  const accountsData = accounts?.data;
  // console.log("accountsData", accountsData); []

  // Error: Route "/" used `searchParams.page`. `searchParams` should be awaited before using its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis
  //   at Home (app\(root)\page.tsx:11:43)


  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;
  // console.log("appwriteItemId", appwriteItemId);  undefined


  const account = await getAccount({ appwriteItemId });


  

  // console.log({accountsData, account});

  return (
    <section className='home'>
      <div className='home-content'>
        <header className='home-header'>
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn?.firstName || 'Guest'}
            subtext="Access and manage your account and transactions efficiently."
          />

          <TotalBalanceBox
            accounts={accountsData}
            totalBanks={accounts?.totalBanks}
            totalCurrentBalance={accounts?.totalCurrentBalance}
          />
        </header>

        {/* <RecentTransactions 
          accounts={accountsData}
          transactions={accounts?.transactions}
          appwriteItemId={appwriteItemId}
          page={currentPage}
        /> */}

      </div>

      <RightSidebar
        user={loggedIn}
        transactions={account?.transactions}
        banks={accountsData?.slice(0, 2)}
      />

    </section>
  )
}

export default Home;

// accountId
// bankId
// accessToken
// fundingSourceUrl
// shareableUrl
// userId

// The Most Likely Cause

// Based on your flow, I strongly suspect:

// 👉 accountsData is empty when page loads
// OR
// 👉 getAccounts() is not returning appwriteItemId