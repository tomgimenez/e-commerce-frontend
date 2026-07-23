import { UserMenu } from '@/components/custom/UserMenu';
import { Notifications } from '@/shop/components/header/Notifications';

export const AdminHeader = () => {

  return (
    <header className="sticky top-0 z-30 h-16 bg-background/95 backdrop-blur border-b border-border">
      <div className="flex items-center justify-end h-full px-6">

        {/* Right side actions */}
        <div className="flex items-center gap-2">

          <Notifications />

          <UserMenu />

        </div>
      </div>
    </header>

  );
};
