#include <stdio.h>
int main() {
    int N, origN, revN = 0, rem;
    printf("Enter an integer: ");
    scanf("%d", &N);
    origN = N;
    while (N != 0) {
        rem = N % 10;          
        revN = revN * 10 + rem;  
        N /= 10;                      
    }
    if (origN == revN) {
        printf("%d is a palindrome number.\n", origN);
    } else {
        printf("%d is not a palindrome number.\n", origN);
    }
    return 0;
}