package com.marvin.calculation;

import java.math.BigDecimal;
import java.math.MathContext;

public class Supermarket {

    private  BigDecimal applePrice = new BigDecimal(8);//苹果价格

    private int appleCount;//苹果重量

    private BigDecimal appleDiscount; //苹果折扣

    private  BigDecimal strawberryPrice  = new BigDecimal(13); //草莓价格

    private int strawberryCount;//草莓重量

    private BigDecimal strawberryDiscount;//草莓折扣

    private  BigDecimal mangoPrice = new BigDecimal(20);//芒果价格

    private int mangoCount;//芒果重量

    private BigDecimal mangoDiscount;//芒果折扣

    public Supermarket(){}

    public Supermarket(int appleCount,BigDecimal appleDiscount ,int strawberryCount,BigDecimal strawberryDiscount ,int mangoCount,BigDecimal mangoDiscount ){
        this.appleCount=appleCount;
        this.appleDiscount=appleDiscount;
        this.strawberryCount=strawberryCount;
        this.strawberryDiscount=strawberryDiscount;
        this.mangoCount=mangoCount;
        this.mangoDiscount=mangoDiscount;
    }
    public Double PayCount(){
        BigDecimal appleTotal = applePrice.multiply(new BigDecimal(appleCount)).multiply(appleDiscount);
        BigDecimal strawberryTotal = strawberryPrice.multiply(new BigDecimal(strawberryCount)).multiply(strawberryDiscount);
        BigDecimal mangoTotal = mangoPrice.multiply(new BigDecimal(mangoCount)).multiply(mangoDiscount);
        BigDecimal total = new BigDecimal(0);
        total = appleTotal.add(strawberryTotal).add(mangoTotal).setScale(2,BigDecimal.ROUND_HALF_UP);
        return total.doubleValue();
    }
}
