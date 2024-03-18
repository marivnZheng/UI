package com.marvin;

import com.marvin.calculation.Calculation;

public class Main {

    public static void main(String[] args) {
        Calculation calculation = new Calculation();
        //假设购买苹果5斤，草莓4斤，芒果5斤
        Double aDouble = calculation.payCount(5, 1d, 4, 0.8d, 5, 1d);
        System.out.println("购买苹果5斤，草莓4斤，芒果5斤 价格为"+aDouble);


        //假设购买苹果4斤，草莓1斤，芒果1斤
        Double bDouble = calculation.payCount(4, 1d, 1, 0.8d, 1, 1d);
        System.out.println("购买苹果4斤，草莓1斤，芒果1斤 价格为"+bDouble);
    }
}
