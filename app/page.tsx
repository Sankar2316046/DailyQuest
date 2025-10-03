import Home from "./_components/home";
import AuthWrapper from "./_components/auth-wrapper";

export default function Page() {

  return (
   <div className="min-h-screen bg-background">
    <AuthWrapper>
      <Home/>
    </AuthWrapper>
   </div>
  )
}
