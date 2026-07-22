if(NOT TARGET fbjni::fbjni)
add_library(fbjni::fbjni SHARED IMPORTED)
set_target_properties(fbjni::fbjni PROPERTIES
    IMPORTED_LOCATION "/private/var/folders/c7/r6_s_1712jb69n7p6ypf19sw0000gn/T/cursor-sandbox-cache/91c25fe7968b9d56c9cc3b2b9ef80121/gradle/caches/9.3.1/transforms/3c01aea05d2737e987399f1309ae090e/transformed/fbjni-0.7.0/prefab/modules/fbjni/libs/android.x86/libfbjni.so"
    INTERFACE_INCLUDE_DIRECTORIES "/private/var/folders/c7/r6_s_1712jb69n7p6ypf19sw0000gn/T/cursor-sandbox-cache/91c25fe7968b9d56c9cc3b2b9ef80121/gradle/caches/9.3.1/transforms/3c01aea05d2737e987399f1309ae090e/transformed/fbjni-0.7.0/prefab/modules/fbjni/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

