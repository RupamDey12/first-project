import java.util.*;

public class Conditions{
    public static <and> void main(String args[]){
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        switch(a and b){
        case 1 -> System.out.println(a + b);
        case 2 -> System.out.println(a * b);
        case 3 -> System.out.println(a - b);
        default -> System.out.println(a % b);

        }
    }
}