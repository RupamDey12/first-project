#include<stdio.h>
#include<math.h>
int main(){ 
    float r,h,v;
    printf("\nEnter the value of radius  & height of the cone:  ");
    scanf("%f %f", &r , &h);
    //calulating volume 
    v=(1.0/3.0)*3.14*pow(r,2)*h;
    printf("\nThe volume of the cone is %.4f cubic units\n", v);
    return 0;
}