interface BookV2 {
  title: string;
  author: string;
  numberOfPages: number;
  dueDate: Date | undefined;
}

function isBookCheckedOut(book: BookV2): boolean {
  if(book.dueDate == undefined) {
    return false;
  } else {
    return true;
  }
}

interface UserV2 {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string | null;
}

function getFullName(user: UserV2): string {
  if(user.middleName == null) {
    return `${user.firstName} ${user.lastName}`;
  } else {
    return `${user.firstName} ${user.middleName} ${user.lastName}`;
  }
}
