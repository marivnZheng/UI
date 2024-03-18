package com.marvin.calculation;

import java.math.BigDecimal;

public class Calculation {

    private Supermarket supermarket;

    public Double payCount(int appleCount,Double appleDisCount,int strawberryCount,Double strawberryDisCount,int mangoCount,Double mangoDisCount){
          this.supermarket = new Supermarket(appleCount,new BigDecimal(appleDisCount),strawberryCount,new BigDecimal(strawberryDisCount),mangoCount,new BigDecimal(mangoDisCount));
        Double total =  supermarket.PayCount();
        if(total>100){
            total=total-10;
        }
        return total;
    }

}
