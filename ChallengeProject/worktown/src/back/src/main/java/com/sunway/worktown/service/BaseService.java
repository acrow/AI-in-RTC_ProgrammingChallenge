package com.sunway.worktown.service;

import com.sunway.worktown.model.SearchModel;
import org.springframework.beans.BeanUtils;

/**
 * 基础Service
 *
 * @author malin
 * @version 1.0
 */
public abstract class BaseService {

    /**
     * 创建查询信息
     *
     * @param searchInfoClass 查询信息类
     * @param searchInfo      查询信息
     * @return 查询信息
     */
    protected <T extends SearchModel> T createSearchInfo(Class<T> searchInfoClass, SearchModel searchInfo) {
        T newSearchInfo = BeanUtils.instantiateClass(searchInfoClass);
        BeanUtils.copyProperties(searchInfo, newSearchInfo);

        return newSearchInfo;
    }
}