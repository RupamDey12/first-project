#include <stdio.h>
 
int main()
{
    float a, b, h;
    float area;
 
    printf("\nEnter the value for two bases & height of the trapezium: ");
    scanf("%f%f%f", &a, &b, &h);
    area = 0.5 * (a + b) * h ;
    printf("Area of the trapezium is: %.2f", area);
    return 0;
}