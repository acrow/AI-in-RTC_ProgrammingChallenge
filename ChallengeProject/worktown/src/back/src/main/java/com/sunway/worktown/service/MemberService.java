package com.sunway.worktown.service;

import com.sunway.worktown.entity.MemberEntity;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

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
     * @param loginName 登录名
     * @return 用户信息
     */
    public MemberEntity getOneByLoginName(String loginName) {
        // 设置查询条件
        Specification<MemberEntity> spec = (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.<String>get("loginName"), loginName);

        // 查询
        return repository.findOne(spec).orElse(null);
    }

    /**
     * 根据登录名取得用户信息
     *
     * @param loginName 登录名
     * @return 用户信息
     */
    public List<MemberEntity> queryByLoginName(String loginName) {
        // 设置查询条件
        Specification<MemberEntity> spec = (root, query, criteriaBuilder) -> criteriaBuilder.equal(root.<String>get("loginName"), loginName);

        // 查询
        return repository.findAll(spec);
    }
}
