package com.sunway.worktown.model;

import java.io.Serializable;
import java.util.Map;

public class TxFRInModel implements Serializable {

    String url;

    Map<String, String> reqParas;

    /**
     * Gets the value of url.
     *
     * @return the value of url
     */
    public String getUrl() {
        return url;
    }

    /**
     * Sets the url.
     *
     * <p>You can use getUrl() to get the value of url</p>
     *
     * @param url url
     */
    public void setUrl(String url) {
        this.url = url;
    }

    /**
     * Gets the value of reqParas.
     *
     * @return the value of reqParas
     */
    public Map<String, String> getReqParas() {
        return reqParas;
    }

    /**
     * Sets the reqParas.
     *
     * <p>You can use getReqParas() to get the value of reqParas</p>
     *
     * @param reqParas reqParas
     */
    public void setReqParas(Map<String, String> reqParas) {
        this.reqParas = reqParas;
    }
}
