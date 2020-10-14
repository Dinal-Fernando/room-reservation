export class Room {
  public  id         : number;
  public  room_number: string ;
  public  price : number ;
  public  checkin    : string ;
  public  checkout   : string ;
  public  meal_details : Meal[];
  public  number_of_adults : string;
  public  number_of_children : string ;
  //  constructor(){}
}

export class Meal {
  public  id         : number;
  public  meal_name  : string;
  public  meal_price : string;
  constructor(){}
}

  