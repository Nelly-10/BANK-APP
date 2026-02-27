import HeaderBox from '@/components/HeaderBox';
import RecentTransactions from '@/components/RecentTransactions';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import { getAccounts, getAccount } from "@/lib/actions/bank.actions";
import RightSidebar from '@/components/RightSidebar';
import { getLoggedInUser } from "@/lib/actions/user.actions";




const Home = async ({ searchParams }: SearchParamProps) => {
  const { id, page } = await searchParams;
  const currentPage = Number(page as string) || 1;
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({
    userId: loggedIn.$id
  });


  if (!accounts) return;

  const accountsData = accounts?.data;

  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;


  const account = await getAccount({ appwriteItemId });

  // console.log({
  //   account,
  //   accountsData
  // })



  return (
    <section className='home no-scrollbar'>
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

        <RecentTransactions
          accounts={accountsData}
          transactions={account?.transactions}
          appwriteItemId={appwriteItemId}
          page={currentPage}
        />

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

// # CPIGEEHS2HQ2T7ZBCPAEJUPVWPXE74ZQ

// #recovery-code V26MEQI53J22CIGGTYYF5O7YIE

// # 699278fb4c01cb002166c9b4 7636d131842ae2ad7c8fb2ea554157