package com.example.demo.service;

import com.example.demo.entity.Course;
import com.example.demo.entity.Discussion;
import com.example.demo.repository.DiscussionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DiscussionService {

    @Autowired
    private DiscussionRepository discussionRepository;

    public List<Discussion> getDiscussionsCourse(Course course) {
        return discussionRepository.findByCourse(course);
    }

    public Discussion createDiscussion(Discussion discussion) {
        return discussionRepository.save(discussion);
    }

    // Add the method to delete discussion by ID
    public boolean deleteDiscussionById(Long id) {
        if (discussionRepository.existsById(id)) {
            discussionRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
