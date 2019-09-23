package com.sunway.worktown.service;

import com.sunway.worktown.annotation.Unique;
import com.sunway.worktown.entity.BaseEntity;
import com.sunway.worktown.exception.CommonException;
import com.sunway.worktown.model.SearchModel;
import com.sunway.worktown.model.SearchResultModel;
import com.sunway.worktown.repository.BaseRepository;
import com.sunway.worktown.util.PageUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.reflect.FieldUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.Assert;

import javax.persistence.criteria.Predicate;
import java.lang.reflect.Field;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * 基础仓库Service
 *
 * @author malin
 * @version 1.0
 */
@Slf4j
public abstract class BaseRepositoryService<T extends BaseEntity> extends BaseService {

    /**
     * 基础仓库
     */
    @Autowired
    protected BaseRepository<T> repository;

    /**
     * 唯一属性列表
     */
    private List<Field> uniquePropertyList;

    /**
     * 构造函数
     */
    public BaseRepositoryService() {
        Type type = getClass().getGenericSuperclass();
        Type[] params = ((ParameterizedType) type).getActualTypeArguments();
        Class<T> entityClass = (Class<T>) params[0];
        uniquePropertyList = FieldUtils.getFieldsListWithAnnotation(entityClass, Unique.class);
    }

    /**
     * 添加信息
     *
     * @param entity 实体信息
     * @return 实体信息
     */
    public T add(T entity) {
        Assert.isNull(entity.getCode(), "添加信息时，编码必须为空");

        // 判断是否信息唯一
        checkInfoUnique(entity);

        // 生成编码
        T existEntity;
        do {
            entity.setCode(UUID.randomUUID().toString().split("-")[0]);
            existEntity = repository.findById(entity.getCode()).orElse(null);
        } while (existEntity != null);

        // 设置共通项目
//        CurrentUserInfo userInfo = getCurrentUser();
//        entity.setCreateUserCode(userInfo.getCode());
//        entity.setCreateUserName(userInfo.getName());
//        entity.setCreateDate(new Date());
//        entity.setUpdateUserCode(null);
//        entity.setUpdateUserName(null);
//        entity.setUpdateDate(null);

        // 保存信息
        return repository.save(entity);
    }

    /**
     * 修改信息
     *
     * @param entity 实体信息
     * @return 实体信息
     */
    public T modify(T entity) {
        Assert.notNull(entity.getCode(), "修改信息时，编码不能为空");

        // 判断是否信息唯一
        checkInfoUnique(entity);

        // 设置共通项目
//        CurrentUserInfo userInfo = getCurrentUser();
//        entity.setUpdateUserCode(userInfo.getCode());
//        entity.setUpdateUserName(userInfo.getName());
//        entity.setUpdateDate(new Date());

        // 保存信息
        return repository.save(entity);
    }

    /**
     * 删除信息
     *
     * @param code 编码
     */
    public void delete(String code) {
        Assert.notNull(code, "删除信息时，编码不能为空");
        repository.deleteById(code);
    }

    /**
     * 根据编码取得实体信息
     *
     * @param code 编码
     * @return 实体信息
     */
    public T getByCode(String code) {
        Assert.notNull(code, "根据编码取得信息时，编码不能为空");
        return repository.findById(code).orElse(null);
    }

    /**
     * 执行分页查询
     *
     * @param spec       查询条件
     * @param searchInfo 查询信息
     * @return 查询结果信息
     */
    protected SearchResultModel<T> doPageSearch(Specification<T> spec, SearchModel searchInfo) {
        return doPageSearch(spec, searchInfo, PageUtil.getSortInfo(searchInfo));
    }

    /**
     * 执行分页查询
     *
     * @param spec       查询条件
     * @param searchInfo 查询信息
     * @param sortInfo   排序信息
     * @return 查询结果信息
     */
    protected SearchResultModel<T> doPageSearch(Specification<T> spec, SearchModel searchInfo, Sort sortInfo) {
        if (!PageUtil.isPaged(searchInfo)) {

            log.debug("not page search.");

            return PageUtil.getSearchResult(searchInfo, repository.findAll(spec, sortInfo));
        }

        Pageable pageInfo = PageUtil.getPageInfo(searchInfo, sortInfo);
        while (true) {
            Page<T> resultPage = repository.findAll(spec, pageInfo);
            Optional<Integer> realIndex = PageUtil.getRealIndex(searchInfo, (int) resultPage.getTotalElements());
            if (realIndex.isPresent()) {

                log.debug("start index out of range, page search again.");

                searchInfo.setPageIndex(realIndex.get());
                pageInfo = PageUtil.getPageInfo(searchInfo, sortInfo);
            } else {
                SearchResultModel<T> model = new SearchResultModel<>();
                model.setIndex(resultPage.getNumber());
                model.setSize(resultPage.getSize());
                model.setTotal((int) resultPage.getTotalElements());
                model.setItems(resultPage.getContent());

                return model;
            }
        }
    }

    /**
     * 检查信息是否唯一
     *
     * @param entity 实体信息
     */
    private void checkInfoUnique(T entity) {
        // 判断是否有唯一属性
        if (uniquePropertyList.isEmpty()) {
            return;
        }

        // 判断属性是否唯一
        for (Field field : uniquePropertyList) {// 设置查询条件
            Specification<T> spec = (root, query, criteriaBuilder) -> {
                List<Predicate> predicateList = new ArrayList<>();
                try {
                    predicateList.add(criteriaBuilder.equal(root.get(field.getName()),
                            FieldUtils.readField(field, entity, true)));
                } catch (IllegalAccessException e) {
                    throw new CommonException(String.format("读取信息时出错！[%s][%s]", entity.getClass(), field.getName()), e);
                } catch (Exception ex) {
                    String msg = ex.getMessage();
                }
                if (entity.getCode() != null) {
                    predicateList.add(criteriaBuilder.notEqual(root.get("code"), entity.getCode()));
                }

                return predicateList.isEmpty() ? null : criteriaBuilder.and(predicateList.toArray(new Predicate[0]));
            };

            // 查询并判断
            if (!repository.findAll(spec).isEmpty()) {
                throw new CommonException(String.format("【%s】已经存在！", field.getAnnotation(Unique.class).name()));
            }
        }
    }
}