package com.sunway.worktown.service;

import com.sunway.worktown.entity.MemberEntity;
import com.sunway.worktown.model.MemberSearchInModel;
import com.sunway.worktown.model.SearchResultModel;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

/**
 * 用户Service
 *
 * @author malin
 * @version 1.0
 */
@Service
public class MemberService extends BaseRepositoryService<MemberEntity> {

    /**
     * 根据登录名取得用户信息
     *
     * @param userName 登录名
     * @return 用户信息
     */
    public MemberEntity getOneByUserName(String userName) {
        // 设置查询条件
        Specification<MemberEntity> spec = (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.<String>get("userName"), userName);

        // 查询
        return repository.findOne(spec).orElse(null);
    }

    /**
     * 根据查询用户的输入信息取得实体信息
     *
     * @param searchInfo 查询用户的输入信息
     * @return 查询结果信息
     */
    public SearchResultModel<MemberEntity> search(MemberSearchInModel searchInfo) {
        // 设置查询条件
        Specification<MemberEntity> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicateList = new ArrayList<>();
            if (StringUtils.isNotBlank(searchInfo.getUserName())) {
                predicateList.add(criteriaBuilder.equal(root.<String>get("userName"), searchInfo.getUserName()));
            }
            if (StringUtils.isNotBlank(searchInfo.getTeamCode())) {
                predicateList.add(criteriaBuilder.equal(root.<String>get("teamCode"), searchInfo.getTeamCode()));
            }

            return predicateList.isEmpty() ? null : criteriaBuilder.and(predicateList.toArray(new Predicate[0]));
        };

        // 查询
        return doPageSearch(spec, searchInfo);
    }
}
