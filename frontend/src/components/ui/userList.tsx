import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { User } from "@/types";

interface UserListProps {
    users: User[];
    handleUserChange: (userId: string) => void;
  }

export function UserList({users, handleUserChange }: UserListProps ) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          className="text-xl py-6 font-semibold bg-orange-400 hover:bg-orange-600 hover:text-white text-white border-none hover:cursor-pointer"

          variant="outline">Click here to change user</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-xl">Change username</SheetTitle>
          <SheetDescription className="text-md">
            Select from list below.
          </SheetDescription>
        </SheetHeader>
          <SheetClose asChild>
        <div className="grid gap-4 py-4">
            {users.map((user) => (
                <Button
                  type="submit" 
                  key={user.id}
                  variant="ghost"
                  className="text-xl font-semibold hover:cursor-pointer"
                  onClick={() => handleUserChange(user.id.toString())}>
                  {user.name}
                </Button>
            ))}

        </div>
          </SheetClose>
      </SheetContent>
    </Sheet>
  )
}
