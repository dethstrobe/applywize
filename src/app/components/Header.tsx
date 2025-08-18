import { link } from "../shared/links";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const Header = () => (<header className="py-5 px-page-side h-20 flex justify-between items-center border-b-1 border-border mb-12">
  <div className="flex items-center gap-8">
    <a href={link("/")} className="flex items-center gap-3 font-display font-bold text-3xl">
      <img src="/images/logo.svg" alt="Apply Wize" className="pt-5 -mb-3" />
      <span>Apply Wize</span>
    </a>
    <nav>
      <ul>
        <li><a href={link("/applications")}>Dashboard</a></li>
      </ul>
    </nav>
  </div>

  <nav>
    <ul className="flex items-center gap-7">
      <li><a href={link("/")}>Settings</a></li>
      <li><a href={link("/user/logout")}>Logout</a></li>
      <li>
        <Avatar>
          <AvatarFallback>Q</AvatarFallback>
          <AvatarImage src="/images/avatar.png" alt="User Avatar" />
        </Avatar>
      </li>
    </ul>
  </nav>
</header>)